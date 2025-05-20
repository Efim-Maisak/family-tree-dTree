import { pb } from "../services/pocketbase-service.js";


const disableOldKeyNode = async (isNewKeyNode, genealogyData) => {
    if(isNewKeyNode) {
        // находим человека - текущую корневую ноду и меняем на false
        try {
            const keyNodePerson = genealogyData.find( person => person.key_node === true);
            await pb.collection("genealogy").update(keyNodePerson.id, { key_node: false });
        }catch(e) {
            throw new Error("Не удалось сбросить текущую корневую ноду при добавлении новой: ", e);
        }
    };
};

export default disableOldKeyNode;