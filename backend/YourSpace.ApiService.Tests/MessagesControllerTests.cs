using Xunit;
using Moq;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using YourSpace.ApiService.Controllers;
using YourSpace.ApiService.Services;
using YourSpace.ApiService.DTOs;
using Microsoft.Extensions.Logging;
using System.Security.Claims;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;

namespace YourSpace.ApiService.Tests
{
    /// <summary>
    /// Unit tests pentru MessagesController. TDD pentru messaging feature.
    /// </summary>
    public class MessagesControllerTests
    {
        [Fact]
        public async Task SendMessage_ReturnsOk_WhenValidRequest()
        {
            // Arrange
            var senderId = 1;
            var receiverId = 2;
            var mock = new Mock<IMessageService>();
            mock.Setup(s => s.SendMessageAsync(senderId, It.IsAny<SendMessageRequest>()))
                .ReturnsAsync(new MessageDto { Id = 1, SenderId = senderId, ReceiverId = receiverId, Content = "Hello" });
            var logger = new Mock<ILogger<MessagesController>>();
            var ctrl = new MessagesController(mock.Object, logger.Object);
            
            // Simulează user autentificat
            var claims = new[] { new Claim("sub", senderId.ToString()) };
            ctrl.ControllerContext = new ControllerContext
            {
                HttpContext = new DefaultHttpContext
                {
                    User = new ClaimsPrincipal(new ClaimsIdentity(claims, "mock"))
                }
            };
            
            var req = new SendMessageRequest { ReceiverId = receiverId, Content = "Hello" };
            
            // Act
            var result = await ctrl.SendMessage(req);
            
            // Assert
            var ok = Assert.IsType<OkObjectResult>(result.Result);
            var message = Assert.IsType<MessageDto>(ok.Value);
            Assert.Equal(1, message.Id);
            Assert.Equal("Hello", message.Content);
        }
        
        [Fact]
        public async Task GetConversations_ReturnsListOfConversations()
        {
            // Arrange
            var userId = 1;
            var mock = new Mock<IMessageService>();
            mock.Setup(s => s.GetConversationsAsync(userId))
                .ReturnsAsync(new List<ConversationDto>
                {
                    new ConversationDto { OtherUserId = 2, OtherUsername = "user2", UnreadCount = 3 }
                });
            var logger = new Mock<ILogger<MessagesController>>();
            var ctrl = new MessagesController(mock.Object, logger.Object);
            
            var claims = new[] { new Claim("sub", userId.ToString()) };
            ctrl.ControllerContext = new ControllerContext
            {
                HttpContext = new DefaultHttpContext
                {
                    User = new ClaimsPrincipal(new ClaimsIdentity(claims, "mock"))
                }
            };
            
            // Act
            var result = await ctrl.GetConversations();
            
            // Assert
            var ok = Assert.IsType<OkObjectResult>(result.Result);
            var conversations = Assert.IsType<List<ConversationDto>>(ok.Value);
            Assert.Single(conversations);
            Assert.Equal(2, conversations[0].OtherUserId);
            Assert.Equal(3, conversations[0].UnreadCount);
        }
        
        [Fact]
        public async Task GetMessages_ReturnsMessagesWithOtherUser()
        {
            // Arrange
            var userId = 1;
            var otherUserId = 2;
            var mock = new Mock<IMessageService>();
            mock.Setup(s => s.GetMessagesWithUserAsync(userId, otherUserId))
                .ReturnsAsync(new List<MessageDto>
                {
                    new MessageDto { Id = 1, SenderId = userId, ReceiverId = otherUserId, Content = "Hi" },
                    new MessageDto { Id = 2, SenderId = otherUserId, ReceiverId = userId, Content = "Hey" }
                });
            var logger = new Mock<ILogger<MessagesController>>();
            var ctrl = new MessagesController(mock.Object, logger.Object);
            
            var claims = new[] { new Claim("sub", userId.ToString()) };
            ctrl.ControllerContext = new ControllerContext
            {
                HttpContext = new DefaultHttpContext
                {
                    User = new ClaimsPrincipal(new ClaimsIdentity(claims, "mock"))
                }
            };
            
            // Act
            var result = await ctrl.GetMessages(otherUserId);
            
            // Assert
            var ok = Assert.IsType<OkObjectResult>(result.Result);
            var messages = Assert.IsType<List<MessageDto>>(ok.Value);
            Assert.Equal(2, messages.Count);
        }
    }
}
