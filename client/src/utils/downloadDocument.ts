export const downloadDocument = () => {
    const link = document.createElement("a");
    link.href = "/documents/document.pdf";
    link.download = "svidetelstvo_o_dopuske.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };