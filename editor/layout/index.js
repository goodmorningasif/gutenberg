/**
 * External dependencies
 */
import { connect } from 'react-redux';
import classnames from 'classnames';

/**
 * WordPress dependencies
 */
import { Component } from '@wordpress/element';
import { NoticeList, Popover, navigateRegions } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import './style.scss';
import Header from '../header';
import Sidebar from '../sidebar';
import TextEditor from '../modes/text-editor';
import VisualEditor from '../modes/visual-editor';
import DocumentTitle from '../document-title';
import { removeNotice, toggleSidebar } from '../actions';
import { MetaBoxes, AutosaveMonitor, UnsavedChangesWarning } from '../components';
import {
	getEditorMode,
	isEditorSidebarOpened,
	getNotices,
} from '../selectors';

class Layout extends Component {
	componentWillReceiveProps( nextProps ) {
		if ( nextProps.isSidebarOpened && nextProps.isMobile && ! this.props.isMobile ) {
			this.props.toggleSidebar();
		}
	}

	render() {
		const { mode, isSidebarOpened, notices } = this.props;
		const className = classnames( 'editor-layout', {
			'is-sidebar-opened': isSidebarOpened,
		} );
		return (
			<div className={ className }>
				<DocumentTitle />
				<NoticeList onRemove={ this.props.removeNotice } notices={ notices } />
				<UnsavedChangesWarning />
				<AutosaveMonitor />
				<Header />
				<div className="editor-layout__content" role="region" aria-label={ __( 'Editor content' ) } tabIndex="-1">
					<div className="editor-layout__editor">
						{ mode === 'text' && <TextEditor /> }
						{ mode === 'visual' && <VisualEditor /> }
					</div>
					<div className="editor-layout__metaboxes">
						<MetaBoxes location="normal" />
					</div>
				</div>
				{ isSidebarOpened && <Sidebar /> }
				<Popover.Slot />
			</div>
		);
	}
}

export default connect(
	( state ) => ( {
		mode: getEditorMode( state ),
		isSidebarOpened: isEditorSidebarOpened( state ),
		notices: getNotices( state ),
		isMobile: ! state.responsive.greaterThan.small,
	} ),
	{ removeNotice, toggleSidebar }
)( navigateRegions( Layout ) );
