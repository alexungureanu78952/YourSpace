# .NET Code Coverage in CI

To enforce code coverage in CI/CD for YourSpace:

## 1. Add Coverlet to Test Project
Already done: Coverlet is installed as a global tool and can be run via CLI.

## 2. Example GitHub Actions Workflow

```yaml
name: .NET CI
on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Setup .NET
        uses: actions/setup-dotnet@v4
        with:
          dotnet-version: '10.0.x'
      - name: Restore dependencies
        run: dotnet restore
      - name: Build
        run: dotnet build --no-restore
      - name: Test with coverage
        run: |
          dotnet tool install --global coverlet.console
          export PATH="$PATH:~/.dotnet/tools"
          dotnet test backend/YourSpace.ApiService.Tests/YourSpace.ApiService.Tests.csproj --no-build
          coverlet backend/YourSpace.ApiService.Tests/bin/Debug/net10.0/YourSpace.ApiService.Tests.dll --target "dotnet" --targetargs "test backend/YourSpace.ApiService.Tests/YourSpace.ApiService.Tests.csproj --no-build" --format opencover --output backend/TestResults/coverage.xml
      - name: Upload coverage report
        uses: actions/upload-artifact@v4
        with:
          name: coverage-report
          path: backend/TestResults/coverage.xml
```

## 3. Coverage Thresholds
You can enforce minimum coverage by adding `--threshold` options to Coverlet or by using a coverage gate tool (e.g., ReportGenerator + fail on low coverage).

## 4. Local Coverage
Run:
```
dotnet test backend/YourSpace.ApiService.Tests/YourSpace.ApiService.Tests.csproj --no-build
coverlet backend/YourSpace.ApiService.Tests/bin/Debug/net10.0/YourSpace.ApiService.Tests.dll --target "dotnet" --targetargs "test backend/YourSpace.ApiService.Tests/YourSpace.ApiService.Tests.csproj --no-build" --format opencover --output backend/TestResults/coverage.xml
```

## 5. View Coverage
Use a tool like ReportGenerator to convert XML to HTML:
```
dotnet tool install --global dotnet-reportgenerator-globaltool
reportgenerator -reports:backend/TestResults/coverage.xml -targetdir:backend/TestResults/coverage-report -reporttypes:Html
```
Open the generated HTML report in your browser.
