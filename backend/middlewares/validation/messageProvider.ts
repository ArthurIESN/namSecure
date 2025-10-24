import vine, { SimpleMessagesProvider } from "@vinejs/vine";

import memberFields  from "./fields/member.js";
import memberRoleFields from "./fields/member_role.js";
import authFields from "./fields/auth.js";

const fields =
    {
        ...memberFields,
        ...memberRoleFields,
        ...authFields
    }

const messages =
    {
        'required': "The {{ field }} field is required.",
        'confirmed': "The {{ field }} field must match the confirmation field.",
        'string': "The value of {{ field }} field must be a string",
        'email': 'The value of {{ field }} field must be a valid email address',
        'minLength': "The value of {{ field }} field must be at least {{ options.0 }} characters long.",
        'maxLength': "The value of {{ field }} field must be at most {{ options.0 }} characters long.",
        'fixedLength': "The value of {{ field }} field must be exactly {{ options.0 }} characters long.",
    }

vine.messagesProvider = new SimpleMessagesProvider(messages, fields);