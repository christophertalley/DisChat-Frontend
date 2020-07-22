module.exports = {
    api:
        process.env.NODE_ENV === "development"
            ? process.env.PROD_API
            : process.env.PROD_API,

    port: process.env.PORT || 4000
};
