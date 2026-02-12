import EditProfileForm from './EditProfileForm';
import { render, fireEvent, waitFor } from '@testing-library/react';

describe('EditProfileForm', () => {
    it('renders and submits form', async () => {
        const user = { id: 1, displayName: 'Test', bio: '', avatarUrl: '', customHtml: '', customCss: '' };
        global.fetch = jest.fn().mockResolvedValue({ ok: true, json: async () => ({}) });
        const { getByText, getByLabelText } = render(<EditProfileForm user={user} />);
        fireEvent.change(getByLabelText(/Display Name/i), { target: { value: 'New Name' } });
        fireEvent.click(getByText(/Save Changes/i));
        await waitFor(() => getByText(/Profile updated!/i));
    });
});
