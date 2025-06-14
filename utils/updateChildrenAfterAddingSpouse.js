import { pb } from "../services/pocketbase-service.js";


const updateChildrenAfterAddingSpouse = async (currentNode, newSpouse) => {
    const batch = pb.createBatch();

    const children = currentNode?.children?.children;
    const parentsArr = [currentNode.id, newSpouse.id];

    console.log('children:', children);
    console.log('parentsArr:', parentsArr);

    if(children && children.length > 0) {
      for (const child of children) {
          batch.collection("genealogy").update(child,
          { parents: { parents: parentsArr }},
          { requestKey: `${child}` });
        };

        try {
            await batch.send();
        } catch (e) {
            console.error("Ошибка обновления массива родителей у детей (pb batch): ", e);
            console.log(e.originalError);
          throw e;
        }

    } else {
      return;
    };
};


export default updateChildrenAfterAddingSpouse;