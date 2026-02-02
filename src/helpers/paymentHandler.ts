// @ts-ignore
import paytabs from 'paytabs_pt2';
import config from '../config';

let profileID = config.paytabs.profile_id,
  serverKey = config.paytabs.server_key,
  region = config.paytabs.region;

paytabs.setConfig(profileID, serverKey, region);
