import {AbilityBuilder, Ability} from '@casl/ability';
import {ability} from './Can';

export function updateAbility(perms) {
  const {can, rules} = new AbilityBuilder(Ability);
  perms.map(perm => {
    can(perm.action, perm.subject);
  });

  ability && ability.update(rules);
}
