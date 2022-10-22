import { extendTheme } from "@chakra-ui/react"


import colors from "./colors"

//Components overrides
import Tooltip from "./components/tooltip"

const overrides = {
  initialColorMode: "dark",
  useSystemColorMode: false,
  colors,
  fonts:  {
    heading: "Gilroy",
    body: "Gilroy",
  },
  // Other foundational style overrides go here
  components: {
    Tooltip,
    // Other components go here
  },
}

export default extendTheme(overrides)