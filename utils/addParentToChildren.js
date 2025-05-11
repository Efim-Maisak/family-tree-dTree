import { pb } from "../js/script.js";


const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));


const addParentToChildren = async (currentNode, newParent, genealogyData) => {
    const parent = genealogyData.find(person => person.id === currentNode.parents?.parents[0]);
    const children = parent.children.children;

    let parentsArr = currentNode.parents?.parents;
    const updatedParentsArr = [...parentsArr, newParent.id];

    for (const child of children) {
        await pb.collection("genealogy").update(child, { parents: { parents: updatedParentsArr }});
        await delay(200);
      };
};

export default addParentToChildren;