import {notification} from "antd";

const openNotificationWithIcon = (type, message, description, placement) => {
    placement = placement || "topRight"
    notification[type]({message, description, placement});
};

export const successNotification = (message, description) =>
    openNotificationWithIcon('success', message, description);

export const errorNotification = (message, description) =>
    openNotificationWithIcon('error', message, description);

export const infoNotification = (message, description) =>
    openNotificationWithIcon('success', message, description);

export const warningNotification = (message, description) =>
    openNotificationWithIcon('success', message, description);