import { configureSundry } from '@nathanstitt/sundry/base'
import select, { components } from 'react-select'
import createable from 'react-select/creatable'
import async from 'react-select/async'

configureSundry({
    reactSelect: { select, async, createable, components },
    portalContainer: null, // will default to 'body'
})
