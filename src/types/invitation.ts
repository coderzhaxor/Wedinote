/* 
[
    {templates: {
        content: "",
        variables: [
            {},
            {},
            {},
        ]
    }},
    contacts: [
        {id: "", name: "", phone: ""},
        {id: "", name: "", phone: ""},
        {id: "", name: "", phone: ""},
    ]
]
*/

export interface TemplateVariable {
    key: string
    value: string
}

export interface TemplateData {
    content: string
    variables: TemplateVariable[]
}

export interface Contact {
    id: number | string
    name: string
    phone: string
    isInvited?: boolean
}

export type GetInvitationsResponse = [
    { templates: TemplateData },
    { contacts: Contact[] }
]
