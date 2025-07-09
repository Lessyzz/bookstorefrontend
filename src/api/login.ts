export async function apiLogin(email: string, password: string) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/login`,
        {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        }
    );

    if (!res.ok) return null;
    const user = await res.json();
    return user;
}

export async function validateToken(token: string): Promise<boolean> {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/token/validate/${token}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
    });
    if (!res.ok) return false;
    const data = await res.json();
    return data;
}