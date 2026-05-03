import ms from 'ms';
import type { StringValue } from 'ms';

export default () => {
    const accessRaw = process.env.JWT_ACCESS_TOKEN_EXPIRE!
    const refreshRaw = process.env.JWT_REFRESH_TOKEN_EXPIRE!

    return {
        port: parseInt(process.env.PORT ?? '8080', 10),
        database: {
            host: process.env.DATABASE_HOST,
            port: parseInt(process.env.DATABASE_PORT ?? '5432', 10)
        },

        jwt: {
            accessExpire: ms(accessRaw as StringValue),
            refreshExpire: ms(refreshRaw as StringValue),
        },
    }
};
