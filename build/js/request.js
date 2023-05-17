"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const buttonElement = document.querySelector(".search__location__button");
const ipv4Element = document.querySelector(".ip__input");
const responseElement = document.querySelector(".response__block");
buttonElement.addEventListener("click", searchIpLocation);
function searchIpLocation() {
    return __awaiter(this, void 0, void 0, function* () {
        const ipAddress = ipv4Element.value;
        const apiUrl = `https://ipapi.co/${ipAddress}/json/`;
        const { validIp, invalidationMessage } = isValidIp(ipAddress);
        if (validIp) {
            try {
                const response = yield fetch(apiUrl);
                const data = yield response.json();
                showResponse(undefined, data.city, data.region, data.country_name, data.latitude, data.longitude);
            }
            catch (error) {
                showResponse("Not found");
            }
        }
        else {
            showResponse(invalidationMessage);
        }
    });
}
function isValidIp(ipAddress) {
    const ipv4RegEx = /^((25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9])(\.|$)){4}$/;
    const validations = [
        {
            condition: () => typeof (ipAddress) !== "string",
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
    ];
    const { condition, message } = validations.find(validation => validation.condition()) || {};
    return {
        validIp: !(() => condition()),
        invalidationMessage: message || ""
    };
}
function showResponse(errorMessage, city, region, country, latitude, longitude) {
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
