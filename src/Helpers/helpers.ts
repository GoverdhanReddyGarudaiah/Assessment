import axios from "axios";
import { SupportTicket } from "./SupportTicket";

export namespace helpers {
  const apiClient = axios.create({
    baseURL: "http://100.27.30.112/api",
  });

  export async function getListofhrefs() {
    const hrefs = await Promise.all(await $$("a").map((link) => link.getAttribute("href")));
    return Array.from(new Set(hrefs.filter((href) => href && href.includes("https"))));
  }

  export async function getResponse(link) {
    return axios.get(link);
  }

  export async function registerNewUser(UserName, Password) {
    return getAPI("/register", {
      email: UserName,
      password: Password,
    });
  }

  export async function login(UserName, Password) {
    return getAPI("/login", {
      email: UserName,
      password: Password,
    });
  }

  export async function createSupportTicket(title, description, user_id) {
    return getAPI("/tickets", {
      title: title,
      description: description,
      user_id: user_id,
    });
  }

  export async function getSupportTicket() {
    return getAPI("/tickets");
  }

  export async function getAPI(endPoint, data?) {
    var response;
    try {
      if (data) {
        response = await apiClient.post(endPoint, data, {
          headers: {
            accept: "application/json",
          },
        });
      } else {
        response = await apiClient.get(endPoint, {
          headers: {
            accept: "application/json",
          },
        });
      }
      return response;
    } catch (error) {
      console.error("Error fetching tickets:", error.response?.data || error.message);
      throw error;
    }
  }
}
