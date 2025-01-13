import { createContext, useContext, useState } from 'react'

const ConfigContext = createContext(undefined)

export function ConfigProvider ({ value, children }) {
  const [config, setConfig] = useState(value)

  const setAppearance = (newAppearance) => {
    setConfig((prevConfig) => ({
      ...prevConfig,
      appearance : newAppearance
    }))
  }

  const contextValue = {
    ...config,
    setAppearance
  }
  return (
    <ConfigContext.Provider value={contextValue}>
      {children}
    </ConfigContext.Provider>
  )
}

export function useConfig () {
  return useContext(ConfigContext)
}
