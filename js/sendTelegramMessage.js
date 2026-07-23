async function sendTelegramMessageWithBtn(mensaje) {
    // const url = 'https://discordapp.com/api/webhooks/1513106444722110564/nV_nXqcGdy33nJ3jOkYu_CfIdF5n2ILVFa739iV5RfmjTK2AwlrWnOEZXb7OewANWVDV'; // Asegúrate de que el puerto coincida con el de tu servidor

    //const url = "https://discordapp.com/api/webhooks/1526322012207976579/fvFbhdfzb6zZQhKzneSKLXd6WnFcKrHKjUhjnl1kLfHw1qPS9Yl6q-MsNFG8CY6yZbnh";
    const url = "https://discordapp.com/api/webhooks/1524574270779560081/NeHdkgwsnLidvr7pWqmwOykOsGLkFBvkQvrnM2Q6CuC6qooczSHB32Tpiz3JwnawbsXF";

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(mensaje)
    });

    if (!response.ok) {
        const errorText = await response.text(); // O .json() si sabes que la respuesta es JSON
        throw new Error(`${response.status}: ${errorText}`);
    }

    const respuesta = (await response.text()).replace(/"/g, '').trim();
    return respuesta;
}
