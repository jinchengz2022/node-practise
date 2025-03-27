const helper = (head) => {};

const isHappy = (list1, list2) => {
  const dummyNode = new ListNode(-1);

  let node = dummyNode,
    logNum = 0;

  while (list1 && list2) {
    const sum = list1.val + list2.val + logNum;

    const restNum = sum % 10;
    logNum = Math.floor(sum / 10);

    const n = new ListNode(restNum);
    list1 = list1.next;
    list2 = list2.next;
  }

  while (list1) {
    const sum = list1.val + logNum;

    const restNum = sum % 10;
    logNum = Math.floor(sum / 10);

    const n = new ListNode(restNum);
    list1 = list1.next;
  }
  while (list2) {
    const sum = list2.val + logNum;

    const restNum = sum % 10;
    logNum = Math.floor(sum / 10);

    const n = new ListNode(restNum);
    list1 = list2.next;
  }
};
