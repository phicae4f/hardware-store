export const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if(element) {
      element.scrollIntoView({
        block: "start"
      })
    }
  }