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
*Januantara*
_______

*Assalamu'alaikum Warahmatullahi Wabarakaatuh*

Maha Suci Allah SWT dengan segala Kebesaran-Nya yang telah menciptakan makhluk-Nya berpasang-pasangan, melalui pesan ini kami ingin menyampaikan kabar bahagia atas pernikahan kami:

*Lisa Oktavia Basrihati*
*&*
*Ferry Farera*

Yang InsyaAllah akan diselenggarakan pada:

*Hari, Tanggal:*
Sabtu, 03 Mei 2025
*Intimate Wedding:*
08:30 s.d. 13:00
*Tempat:*
Ponyo Nagreg (Gedung Komara)

Link Undangan:
*https://satu.love/lisa-ferry?to=Januantara*

Do'a restu menjadi keberkahan untuk pernikahan kami menjadi keluarga yang sakinnah mawadah warrahmah.

Wassalamu'alaikum Warahmatullahi Wabarakaatuh

Lisa & Ferry`;

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