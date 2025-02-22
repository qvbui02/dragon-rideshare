import axios from "axios";
import { ChatMessage } from "../components/Chat";

export interface ChatMessageWithUsername extends ChatMessage {
    username: string;
}

export const fetchHistoricMessages = async (trip_id: string): Promise<ChatMessageWithUsername[]> => {
    try {
        const response = await axios.get(`/api/chat/inbox/${trip_id}`, {withCredentials: true });
        return response.data.historic_message;
    } catch (error) {
        console.error("Error fetching messages:", error);
        return [];
    }
};

export const saveMessages = async (trip_id: string, message: string, sent_at: string): Promise<void> => {
    try {
        const trip_id_numeric = Number(trip_id);
        const response = await axios.post(`/api/chat/message`, 
            {
            trip_id: trip_id_numeric,
            message: message,
            sent_at: sent_at,
          },
          {withCredentials: true}
        );
        console.log(response.data);
    } catch (error) {
        console.error("Error saving message:", error);
    }
}