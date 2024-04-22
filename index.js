const express = require('express');
const axios = require('axios');

const app = express();
const PORT = 1000;

const healthCheckUrls = [
    { url: 'http://127.0.0.1:8082/q/health', name: 'Payment Service' },
    { url: 'http://localhost:8081/actuator/health', name: 'Users Service' }
];

async function performHealthCheck() {
    const healthChecks = [];

    for (const { url, name } of healthCheckUrls) {
        try {
            const response = await axios.get(url);
            healthChecks.push({ name, url, status: response.status, data: response.data });
        } catch (error) {
            healthChecks.push({ name, url, status: 'Error', error: error.message });
        }
    }

    return healthChecks;
}

app.get('/health', async (req, res) => {
    try {
        const healthStatus = await performHealthCheck();
        res.json(healthStatus);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
