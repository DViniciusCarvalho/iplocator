import { ValidationResponse } from "./types/types";

const buttonElement = document.querySelector(".search__location__button") as HTMLButtonElement;
const ipv4Element = document.querySelector(".ip__input") as HTMLInputElement;
const responseElement = document.querySelector(".response__block") as HTMLPreElement;

buttonElement.addEventListener("click", searchIpLocation);


async function searchIpLocation(): Promise<void> {
    
    const ipAddress = ipv4Element.value;
    const apiUrl = `https://api.ipgeolocation.io/v2/ipgeo?apiKey=af2a6fe19dd7419ea1db6c59fe71b1a9&ip=${ipAddress}`;

    const { validIp, invalidationMessage } = isValidIp(ipAddress);

    if (validIp) {
        try {

            const response = await fetch(apiUrl);
            const data = await response.json();

            showResponse(
                undefined, 
                data.location.city, 
                data.location.district, 
                data.location.country_name, 
                data.location.latitude, 
                data.location.longitude
            );

        }
        catch(error) {
            showResponse("Not found");
        }
    }
    else {
        showResponse(invalidationMessage);
    }

}

function isValidIp(ipAddress: string): ValidationResponse {

    const ipv4RegEx = /^((25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])(\.|$)){4}$/;

    const validations = [
        {
            condition: () => typeof(ipAddress) !== "string",
            message: "Just strings are accepted."
        },        
        {
            condition: () => !ipAddress.match(ipv4RegEx),
            message: "You must provide a valid ipv4 format. Ex.: 255.255.255.255."
        },
        {
            condition: () => !ipAddress.length,
            message: "An ip address wasn't provided."
        }
    ]

    const { condition, message } = validations.find(validation => validation.condition()) || {
        condition: () => false,
        message: ""
    };

    return {
        validIp: !condition(),
        invalidationMessage: message
    };

}

function showResponse(
    errorMessage: undefined | string, 
    city?: string, 
    region?: string, 
    country?: string, 
    latitude?: string, 
    longitude?: string
): void {

    const stringTypeRegEx = /"([^"]*)"/g;
    const numberTypeRegEx = /-?\d+(?:\.\d+)?/g;

    if (errorMessage) {
        responseElement.innerHTML = `<span class="error">${errorMessage}</span>`;
        return;
    }

    const cityMessage = `City: "${city}"`;
    const regionMessage = `Region: "${region}"`;
    const countryMessage = `Country: "${country}"`;
    const latitudeMessage = `Latitude: ${latitude}`;
    const longitudeMessage = `Longitude: ${longitude}`;
    const responseMessage = `${cityMessage}\n${regionMessage}\n${countryMessage}\n${latitudeMessage}\n${longitudeMessage}`;

    const colorfulFormattedResponseData = responseMessage
    .replace(stringTypeRegEx, '<span class="string">"$1"</span>')
    .replace(numberTypeRegEx, '<span class="number">$&</span>');

    responseElement.innerHTML = colorfulFormattedResponseData;

}
