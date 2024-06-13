const BASE_API_URL = "http://20.193.133.240:9002";


export async function getApi(apiName: string) {
    try {
        const response = await fetch(`${BASE_API_URL}/${apiName}`, {
            method: "GET",
            mode: "cors",
            headers: {
                "Content-Type": "application/json",
            }
        });
        const parsedResponse = await response.json();
        if (response.status > 299 || !response.ok) {
            throw Error(parsedResponse.error || "Unknown error");
        }
        return parsedResponse;
    } catch (err) {
        return [];
    }
}


export async function postApi(options: any, apiName: string): Promise<any> {
    try {
        const response = await fetch(`${BASE_API_URL}/${apiName}`, {
            method: "POST",
            body: JSON.stringify(options),
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            }
        });

        const parsedResponse = await response.json();
        if (!response.ok) {
            throw Error(parsedResponse.error || "Unknown error");
        }

        return parsedResponse;
    } catch (err) {
        return [];
    }
}