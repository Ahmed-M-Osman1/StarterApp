import {createContext} from 'react';
import {createContextualCan} from '@casl/react';
import {defineAbility} from '@casl/ability';

export const AbilityContext = createContext();
export const Can = createContextualCan(AbilityContext.Consumer);
export const ability = defineAbility((can, cannot) => {});
