import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Glyphicon } from 'react-bootstrap'
import _ from 'lodash'
import * as LineActions from 'actions/lines'
import LineView from 'components/timeline/lineView'
import orientedClassName from 'helpers/orientedClassName'

class LineListView extends Component {

  labelMap () {
    var mapping = {}
    this.props.tags.forEach((t) => {
      mapping[t.title.toLowerCase()] = t.color
    })
    this.props.characters.forEach((c) => {
      mapping[c.name.toLowerCase()] = c.color
    })
    this.props.places.forEach((p) => {
      mapping[p.name.toLowerCase()] = p.color
    })
    return mapping
  }

  handleCreateNewLine () {
    this.props.actions.addLine()
  }

  handleReorder (originalLinePosition, droppedLinePosition) {
    var linesArray = []
    this.props.lines.forEach((l) => {
      var newLine = _.clone(l)
      if (l.position >= originalLinePosition && l.position !== droppedLinePosition) {
        newLine.position += 1
      } else if (l.position === droppedLinePosition) {
        newLine.position = originalLinePosition
      }
      linesArray.push(newLine)
    })
    // potentially we'd want to reset all the positions so there aren't any gaps
    this.props.actions.reorderLines(linesArray)
  }

  render () {
    var lineViews = this.renderLines()
    return (<div className={orientedClassName('line-list', this.props.orientation)}>
      {lineViews}
      <div className={orientedClassName('line-list__new', this.props.orientation)} onClick={this.handleCreateNewLine.bind(this)} >
        <Glyphicon glyph='plus' />
      </div>
    </div>)
  }

  renderLines () {
    const lines = _.sortBy(this.props.lines, 'position')
    return lines.map((line) => {
      return (
        <LineView key={'lineId-' + line.id}
          line={line}
          sceneMap={this.props.sceneMap}
          labelMap={this.labelMap()}
          handleReorder={this.handleReorder.bind(this)}
          filteredItems={this.props.filteredItems}
          isZoomed={this.props.isZoomed}
          zoomIn={this.props.zoomIn}
          />
      )
    })
  }
}

LineListView.propTypes = {
  lines: PropTypes.array.isRequired,
  sceneMap: PropTypes.object.isRequired,
  actions: PropTypes.object.isRequired,
  filteredItems: PropTypes.object.isRequired,
  tags: PropTypes.array.isRequired,
  characters: PropTypes.array.isRequired,
  places: PropTypes.array.isRequired,
  isZoomed: PropTypes.bool.isRequired,
  zoomIn: PropTypes.func.isRequired,
  orientation: PropTypes.string.isRequired
}

function mapStateToProps (state) {
  return {
    lines: state.lines,
    places: state.places,
    characters: state.characters,
    tags: state.tags,
    orientation: state.ui.orientation
  }
}

function mapDispatchToProps (dispatch) {
  return {
    actions: bindActionCreators(LineActions, dispatch)
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LineListView)
