import { initializeReactSelect } from '@nathanstitt/sundry/form'

import select, { components } from 'react-select'
import createable from 'react-select/creatable'
import async from 'react-select/async'

initializeReactSelect({ select, async, createable, components })
