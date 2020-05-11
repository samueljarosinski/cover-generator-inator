if (figma.currentPage.selection.length !== 1) figma.closePlugin('Select single image');

const node = figma.currentPage.selection[0] as RectangleNode

if (node.type !== 'RECTANGLE') figma.closePlugin('Select single image')
if (node.fills[0].type !== 'IMAGE') figma.closePlugin('Select single image')

const width = node.width
const height = node.height

const slice = figma.createSlice()
slice.resize(width, height)
slice.x = node.x
slice.y = node.y

node.resize(width * 1.2, height * 1.2)
node.effects = [{ type: 'LAYER_BLUR', radius: 4, visible: true }]
node.rotation = 6

const group = figma.group([node, slice], figma.currentPage)
slice.x = group.x + (group.width - slice.width) / 2
slice.y = group.y + (group.height - slice.height) / 2

slice.exportAsync().then((data) => {
    figma.showUI(ui, { visible: false })
    figma.ui.postMessage(String.fromCharCode.apply(null, data))
})

figma.ui.onmessage = () => {
    const selection = []
    selection.push(slice)
    figma.currentPage.selection = selection

    figma.closePlugin()
}

const ui = `
<script>
    onmessage = (message) => {
        const download = document.createElement('a')
        download.href = 'data:image/png;base64,' + btoa(message.data.pluginMessage);
        download.download = 'cover.png'
        download.click()

        parent.postMessage({ pluginMessage: '' }, '*')
    }
</script>
`
