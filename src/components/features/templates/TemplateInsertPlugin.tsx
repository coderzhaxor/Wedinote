import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $getRoot, $createParagraphNode, $createTextNode } from "lexical";
import { useEffect } from "react";

interface TemplateInsertPluginProps {
    shouldInsert: boolean;
    onInserted: () => void;
}

export default function TemplateInsertPlugin({ shouldInsert, onInserted }: TemplateInsertPluginProps) {
    const [editor] = useLexicalComposerContext();

    const templateText = `Kepada YTH.\nBapak/Ibu/Saudara/i\n*Januantara*\n_______\n\n*Assalamu'alaikum Warahmatullahi Wabarakaatuh*\n\nMaha Suci Allah SWT dengan segala Kebesaran-Nya yang telah menciptakan makhluk-Nya berpasang-pasangan, melalui pesan ini kami ingin menyampaikan kabar bahagia atas pernikahan kami:\n\n*Lisa Oktavia Basrihati*\n*&*\n*Ferry Farera*\n\nYang InsyaAllah akan diselenggarakan pada:\n\n*Hari, Tanggal:*\nSabtu, 03 Mei 2025\n*Intimate Wedding:*\n08:30 s.d. 13:00\n*Tempat:*\nPonyo Nagreg (Gedung Komara)\n\nLink Undangan:\n*https://satu.love/lisa-ferry?to=Januantara*\n\nDo'a restu menjadi keberkahan untuk pernikahan kami menjadi keluarga yang sakinnah mawadah warrahmah.\n\nWassalamu'alaikum Warahmatullahi Wabarakaatuh\n\nLisa & Ferry`;

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