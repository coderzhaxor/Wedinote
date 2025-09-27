import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $getRoot, $createParagraphNode, $createTextNode } from "lexical";
import { useEffect } from "react";

interface TemplateInsertPluginProps {
    shouldInsert: boolean;
    onInserted: () => void;
}

export default function TemplateInsertPlugin({ shouldInsert, onInserted }: TemplateInsertPluginProps) {
    const [editor] = useLexicalComposerContext();

    const templateText = `Kepada YTH.\nBapak/Ibu/Saudara/i\n*{{nama_tamu}}*\n_______\n\n*Assalamu'alaikum Warahmatullahi Wabarakaatuh*\n\nMaha Suci Allah SWT dengan segala Kebesaran-Nya yang telah menciptakan makhluk-Nya berpasang-pasangan, melalui pesan ini kami ingin menyampaikan kabar bahagia atas pernikahan kami:\n\n*{{nama_cpw}}*\n*&*\n*{{nama_cpp}}*\n\nYang InsyaAllah akan diselenggarakan pada:\n\n*Hari, Tanggal:*\n{{tgl}}\n*Intimate Wedding:*\n{{waktu}}\n*Tempat:*\n{{tempat}}\n\nLink Undangan:\n{{link_undangan}}\n\nDo'a restu menjadi keberkahan untuk pernikahan kami menjadi keluarga yang sakinnah mawadah warrahmah.\n\nWassalamu'alaikum Warahmatullahi Wabarakaatuh\n\nLisa & Ferry`;

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