export interface Store {
    emails: Email[];
    templates: Map<string, Template>;
}
export interface Email {
    messageId: string;
    from: string;
    replyTo: string[];
    destination: {
        to: string[];
        cc: string[];
        bcc: string[];
    };
    subject: string;
    body: {
        html?: string;
        text?: string;
    };
    attachments: {
        content: string;
        contentType: string;
        filename?: string;
        size: number;
    }[];
    at: number;
}
export interface Template {
    TemplateContent: {
        Html: string;
        Subject: string;
        Text: string;
    };
    TemplateName: string;
}
export declare const saveEmail: (email: Email) => void;
export declare const hasTemplate: (key: string) => boolean;
export declare const getTemplate: (key: string) => Readonly<Template> | undefined;
export declare const setTemplate: (key: string, value: Template) => Map<string, Template>;
export declare const deleteTemplate: (templateName: string) => boolean;
export declare const clearStore: () => void;
export declare const getStoreReadonly: () => Readonly<Store>;
