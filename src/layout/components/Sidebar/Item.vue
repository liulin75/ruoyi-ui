<script>
export default {
  name: 'MenuItem',
  functional: true,
  props: {
    icon: {
      type: String,
      default: ''
    },
    img: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: ''
    }
  },
  render(h, context) {
    const { icon,img, title } = context.props
    const vnodes = []

    if (icon) {
      vnodes.push(<svg-icon icon-class={icon}/>)
    }
    
    // 如果传入了 img（图片路径）
    if (img) {
      // 让 @/assets 路径正确解析
      const imgSrc = require(`@/assets/${img}`)
      vnodes.push(
        <img
          src={imgSrc}
          class="menu-img"
          style="width: 16px; height: 16px; margin-right: 6px;"
        />
      )
    }

    if (title) {
      if (title.length > 5) {
        vnodes.push(<span slot='title' title={(title)}>{(title)}</span>)
      } else {
        vnodes.push(<span slot='title'>{(title)}</span>)
      }
    }
    return vnodes
  }
}
</script>