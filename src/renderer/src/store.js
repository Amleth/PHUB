import { atom, getDefaultStore } from 'jotai'

export const filesAtom = atom([])

export function setTitle(md5, title) {

}

const defaultStore = getDefaultStore()

async function fetchFiles() {
  let _files = await window.electron.ipcRenderer.invoke('fetch-files')
  
  defaultStore.set(filesAtom, _files)
}

fetchFiles()