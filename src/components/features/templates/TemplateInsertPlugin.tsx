import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $getRoot, $createParagraphNode, $createTextNode } from "lexical";
import { useEffect } from "react";

interface TemplateInsertPluginProps {
    shouldInsert: boolean;
    onInserted: () => void;
}

export default function TemplateInsertPlugin({ shouldInsert, onInserted }: TemplateInsertPluginProps) {
    const [editor] = useLexicalComposerContext();

    const templateText = `Kepada YTH.
Bapak/Ibu/Saudara/i
*{{nama_tamu}}*

*Assalamu'alaikum Warahmatullahi Wabarakaatuh*

Maha Suci Allah SWT dengan segala Kebesaran-Nya yang telah menciptakan makhluk-Nya berpasang-pasangan, melalui pesan ini kami ingin menyampaikan kabar bahagia atas pernikahan kami:

*{{nama_cpw}}*
*&*
*{{nama_cpp}}*

Yang InsyaAllah akan diselenggarakan pada:

*Hari, Tanggal:*
{{tgl}}
*Intimate Wedding:*
{{waktu}}
*Tempat:*
{{tempat}}

Link Undangan:
{{link_undangan}}

Do'a restu menjadi keberkahan untuk pernikahan kami menjadi keluarga yang sakinnah mawadah warrahmah.

Wassalamu'alaikum Warahmatullahi Wabarakaatuh

{{nama_singkat_cpw}} & {{nama_singkat_cpp}}`;

    useEffect(() => {
        if (shouldInsert) {
            editor.update(() => {
                const root = $getRoot();
                root.clear();

                const lines = templateText.split('\n');
                lines.forEach((line) => {
                    const paragraph = $createParagraphNode();
                    const textNode = $createTextNode(line);
                    paragraph.append(textNode);
                    root.append(paragraph);
                });
            });
            onInserted();
        }
    }, [shouldInsert, editor, onInserted]);

    return null;
}