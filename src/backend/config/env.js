const config = {
    PORT: process.env.PORT || 10000,
    DATABASE_URL: process.env.DATABASE_URL,
};

for (const [key, value] of Object.entries(config)) {
    if (value === undefined) {
        console.error(`FATAL: Missing environment variable '${key}'`);
        process.exit(1);
    }
}

module.exports = config;