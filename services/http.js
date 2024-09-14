const httpService = () => {
    let isLoading = true;
    let isError = false;

    const request = async (url, method = "GET", body = null) => {
        try {
            let options = {
                method: method,
                headers: {
                  'Content-Type': 'application/json'
                }
            }

            if(method !== "GET") {
                options.body = JSON.stringify(body)
            }

            let response = await fetch(url, options);

              if(response.ok) {
                let result = await response.json();
                isLoading = false;
                isError = false;
                return result;
              } else {
                isError = true;
                isLoading = false;
              }
        } catch(e) {
            throw new Error("Ошибка http запроса: " + e.message);
        }
    }

    return {
        request,
        isLoading,
        isError
    }
}

export default httpService;