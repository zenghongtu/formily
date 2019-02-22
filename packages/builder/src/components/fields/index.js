import React, { Component } from 'react'
import cls from 'classnames'
import PropTypes from 'prop-types'
import defaultSupportFieldList from '../../configs/supportFieldList'
import { Header } from '../../utils/util'
import { connect } from 'react-redux'
import {
  addComponent,
  editComponent,
  showComponentProps,
  changeComponent,
  addComponentAndEdit
} from '../../actions'
import uniqBy from 'lodash.uniqby'
import styled from 'styled-components'

class FieldList extends Component {
  static propTypes = {
    // addComponent: PropTypes.func,
    // eslint-disable-next-line
    supportFieldList: PropTypes.array,
    includeFieldListKeyList: PropTypes.arrayOf(PropTypes.string)
  }

  static defaultProps = {
    supportFieldList: [],
    includeFieldListKeyList: []
  }

  constructor(props) {
    super(props)
    const { supportFieldList, includeFieldListKeyList } = props
    this.fieldList = defaultSupportFieldList
    if (supportFieldList.length) {
      this.fieldList = uniqBy(
        [...supportFieldList, ...defaultSupportFieldList],
        'key'
      )
    }
    if (includeFieldListKeyList.length) {
      this.fieldList = this.fieldList.filter(
        fieldItem => includeFieldListKeyList.indexOf(fieldItem.key) > -1
      )
    }
  }

  onDragStart = (ev, fieldItem) => {
    ev.dataTransfer.setData('text/plain', JSON.stringify(fieldItem))
    // eslint-disable-next-line
    ev.dataTransfer.dropEffect = 'copy'
  }

  wrapFieldItem = fieldItem =>
    typeof fieldItem === 'string'
      ? {
        type: fieldItem,
        icon: '',
        iconUrl: 'gw.alicdn.com/tfs/TB10xa4DbrpK1RjSZTEXXcWAVXa-116-60.png',
        width: '58',
        height: '30',
        title: '自定义组件'
      }
      : fieldItem

  renderFieldList() {
    const _addComponent = this.props.addComponentAndEdit
    return (
      <ul className='field-list'>
        {this.fieldList.map((fieldItem, i) => {
          const newFieldItem = this.wrapFieldItem(fieldItem)
          const {
            key,
            iconUrl = '//gw.alicdn.com/tfs/TB10xa4DbrpK1RjSZTEXXcWAVXa-116-60.png',
            width,
            height
          } = newFieldItem
          return (
            <li
              key={key}
              draggable
              onDragStart={ev => this.onDragStart(ev, newFieldItem)}
              onClick={() => {
                _addComponent && _addComponent(newFieldItem)
              }}
            >
              <i
                className='field-icon'
                style={{
                  backgroundImage: `url(${iconUrl})`,
                  width: '100%',
                  // width: `${width}px`,
                  // height: `${height}px`,
                  backgroundSize: `${width}px ${height}px`
                }}
              />
              <span>{newFieldItem.title}</span>
            </li>
          )
        })}
      </ul>
    )
  }

  render() {
    return (
      <div className={cls('col-card col-fields', this.props.className)}>
        <Header>
          <h2>组件</h2>
          <p>可将选项拖动到主面板进行编辑</p>
        </Header>
        {this.renderFieldList()}
      </div>
    )
  }
}

const mapStateToProps = () => ({})

const mapDispatchToProps = dispatch => ({
  addComponent: component => dispatch(addComponent(component)),
  editComponent: (id, propsData, containerId) =>
    dispatch(editComponent(id, propsData, containerId)),
  showComponentProps: (id, comp) => dispatch(showComponentProps(id, comp)),
  changeComponent: componentId => dispatch(changeComponent(componentId)),
  addComponentAndEdit: component => dispatch(addComponentAndEdit(component))
})

const StyledFieldList = styled(FieldList)`
  .field-list {
    font-size: 0;
    li {
      overflow: hidden;
      margin-bottom: 12px;
      padding: 0 8px;
      display: inline-block;
      width: 33.33%;
      height: 75px;
      font-size: 12px;
      text-align: center;
      color: ${props => props.theme.whiteColor};
      box-sizing: border-box;
      transition: all 0.1s ease;
      cursor: pointer;
      &:hover {
        background: ${props => props.theme.compHoverBgColor};
      }
      span {
        display: block;
        margin: auto;
        max-width: 36px;
        height: 32px;
        word-break: break-all;
      }
    }
  }
  .field-icon {
    display: block;
    margin: 0 auto 12px;
    height: 30px;
    background-repeat: no-repeat;
    background-position: 50% 50%;
  }
  @media screen and (max-width: 834px) {
    .field-list {
      li {
        width: 100%;
      }
    }
  }
`

class StyledFieldListComp extends React.Component {
  render() {
    return <StyledFieldList {...this.props} />
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(StyledFieldListComp)
