export const authClient = {
    signOut: async () => {
        console.log('Mock signOut');
        window.location.href = '/auth';
    }
}

export function useSession() {
    return {
        data: {
            user: {
                id: 'mock-user-id',
                email: 'demo@pulsemetric.com',
                name: 'Demo User'
            }
        },
        isPending: false
    }
}
