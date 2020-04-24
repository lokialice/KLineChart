/**
 * Copyright (c) 2019 lihu
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:

 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.

 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

import { InvalidateLevel } from '../data/ChartData'
import { getPixelRatio } from '../utils/canvas'

export default class Widget {
  constructor (props) {
    this._width = 0
    this._height = 0
    this._initElement(props.container)
    this._mainView = this._createMainView(this._element, props)
    this._expandView = this._createExpandView(this._element, props)
    this._floatLayerView = this._createFloatLayerView(this._element, props)
  }

  /**
   * 初始化element
   * @param container
   * @private
   */
  _initElement (container) {
    this._element = document.createElement('div')
    this._element.style.margin = '0'
    this._element.style.padding = '0'
    this._element.style.width = '100%'
    this._element.style.height = '100%'
    this._element.style.position = 'relative'
    this._element.style.overflow = 'hidden'
    container.appendChild(this._element)
  }

  /**
   * 创建主view
   * @param container
   * @param props
   * @private
   */
  _createMainView (container, props) {}

  /**
   * 创建拓展的view
   * @param container
   * @param props
   * @private
   */
  _createExpandView (container, props) {}

  /**
   * 创建浮层view
   * @param container
   * @param props
   * @private
   */
  _createFloatLayerView (container, props) {}

  /**
   * 设置尺寸
   * @param width
   * @param height
   */
  setSize (width, height) {
    this._width = width
    this._height = height
    this._mainView.setSize(width, height)
    this._floatLayerView.setSize(width, height)
  }

  /**
   * 更新
   * @param level
   */
  invalidate (level) {
    switch (level) {
      case InvalidateLevel.FLOAT_LAYER: {
        this._floatLayerView.flush()
        break
      }
      case InvalidateLevel.MAIN:
      case InvalidateLevel.FULL: {
        this._mainView.flush()
        this._floatLayerView.flush()
        break
      }
      default: {
        break
      }
    }
  }

  /**
   * 将widget转换成图片
   * @param includeFloatLayer
   * @param includeGraphicMark
   * @returns {HTMLCanvasElement}
   */
  getImage (includeFloatLayer, includeGraphicMark) {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const pixelRatio = getPixelRatio(ctx)
    canvas.style.width = `${this._width}px`
    canvas.style.height = `${this._height}px`
    canvas.width = this._width * pixelRatio
    canvas.height = this._height * pixelRatio
    ctx.scale(pixelRatio, pixelRatio)

    ctx.drawImage(this._mainView.getImage(), 0, 0, this._width, this._height)

    if (includeGraphicMark && this._expandView) {
      ctx.drawImage(this._expandView.getImage(), 0, 0, this._width, this._height)
    }
    if (includeFloatLayer) {
      ctx.drawImage(this._floatLayerView.getImage(), 0, 0, this._width, this._height)
    }
    return canvas
  }
}