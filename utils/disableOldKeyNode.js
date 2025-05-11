import { pb } from "../js/script.js";


const disableOldKeyNode = async (isNewKeyNode, genealogyData) => {
    if(isNewKeyNode) {
        // находим человека - текущую корневую ноду и меняем на false
        const keyNodePerson = genealogyData.find( person => person.key_node === true);
        await pb.collection("genealogy").update(keyNodePerson.id, { key_node: false });
    }
};

export default disableOldKeyNode;