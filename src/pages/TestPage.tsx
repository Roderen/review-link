import { useAuth } from '@/contexts/AuthContext.tsx';

const TestPage = () => {
    const { user } = useAuth();

    return (
        <div style={{color: 'white', padding: '50px', fontSize: '24px'}}>
            <h1>TEST PAGE</h1>
            <p>User: {user ? user.name : 'No user'}</p>
        </div>
    );
};

export default TestPage;