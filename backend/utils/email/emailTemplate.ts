import fs from 'fs';
import path from 'path';
import handlebars from 'handlebars';

export function renderEmail(templateName: string, data: object): string
{
    const filePath = path.join(process.cwd(), 'emails', `${templateName}.hbs`);
    const source = fs.readFileSync(filePath, 'utf-8');
    const template = handlebars.compile(source);
    return template(data);
}
