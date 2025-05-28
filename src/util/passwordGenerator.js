export const generateSecurePassword = (length = 12) => {
    const upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lower = 'abcdefghijklmnopqrstuvwxyz';
    const digits = '0123456789';
    const symbols = '!@#$%^&*'; // <- compatibles con bcrypt
    const all = upper + lower + digits + symbols;

    if (length < 8) length = 8;

    const getRand = (chars) => chars[Math.floor(Math.random() * chars.length)];

    let password = [
        getRand(upper),
        getRand(lower),
        getRand(digits),
        getRand(symbols),
    ];

    for (let i = password.length; i < length; i++) {
        password.push(getRand(all));
    }

    for (let i = password.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [password[i], password[j]] = [password[j], password[i]];
    }

    return password.join('');
};
