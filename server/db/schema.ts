import { relations } from "drizzle-orm";
import { boolean, date, integer, pgTable, varchar } from "drizzle-orm/pg-core";
/*{"Team":1,"TCode":"LONG","TName":"Longmeadow High School","Short":"Lancers","LSC":"NE","TState":"MA","TCntry":"USA","TType":"HS","Reg":"USS","MinAge":0,"NumAth":59,"TM2000":0}
 */

export const teamsTable = pgTable("teams", {
  team: integer().primaryKey(),
  tCode: varchar(),
  tName: varchar(),
  short: varchar(),
  lsc: varchar(),
  tState: varchar(),
  tCntry: varchar(),
  tType: varchar(),
  reg: varchar(),
  minAge: integer(),
  numAth: integer(),
  tm2000: integer(),
});

export const athleteTable = pgTable("athletes", {
  athlete: integer().primaryKey(),
  team1: integer(),
  team2: integer(),
  team3: integer(),
  group: varchar(),
  subGr: varchar(),
  last: varchar(),
  first: varchar(),
  sex: varchar(),
  age: integer(),
  class: varchar(),
  inactive: boolean(),
  wmGroup: varchar(),
  wmSubGr: varchar(),
  diveCertified: boolean(),
  awRegType: varchar(),
  foreign: boolean(),
  lastUpdated: date(),
  pcHide: boolean(),
});
/*{"Meet":144,"MName":"LhsvsEhs","Start":"12/16/23 00:00:00","End":"12/16/23 00:00:00","Course":"Y","Location":"LHS","IndCharge":0,"RelCharge":0,"SurCharge":0,"MaxIndEnt":2,"MaxRelEnt":3,"MaxEnt":4,"RestrictBest":0,"NonConform":0,"EnterAtQTime":0,"FacilityFee":0,"TeamFee":0,"MinAge":0,"EnforceQualifying":0,"Altitude":0,"EnforceSlowQtime":0,"BanNoTimes":0,"FastToSlow":0,"Masters":0,"ActiveFeeXMLSent":0,"MinAge10AndUnder":0,"DeadLine":"12/16/23 00:00:00","CustIndCharge":0,"CustRelCharge":0,"CustSurCharge":0,"CustIndAction":0,"CustRelAction":0,"CustSurAction":0,"UseCustomFees":0,"City":"Longmeadow","State":"MA","ZIP":"01007","Cntry":"USA","OMEEntryStyle":3,"AllowCustomTimes":0,"ExportEntriesDate":"12/19/23 00:00:00","UseSwimmersTeam":1,"HonorInviteList":0,"EntryTeam":0,"CollectFeesOnline":0,"OMEValidated":0,"OMECustomTeam":0,"OMEFilterTeam":0,"OMENeedSync":0,"OnlyPreEntered":0,"OMENeedsSync":0,"FileExportType":1}
*/
export const meetTable = pgTable("meets", {
  meet: integer().primaryKey(),
  mName: varchar(),
  start: date(),
  end: date(),
  course: varchar(),
  location: varchar(),
  indCharge: integer(),
  relCharge: integer(),
  surCharge: integer(),
  maxIndEnt: integer(),
  maxRelEnt: integer(),
  maxEnt: integer(),
  restrictBest: integer(),
  nonConform: integer(),
  enterAtQTime: integer(),
  facilityFee: integer(),
  teamFee: integer(),
  minAge: integer(),
  enforceQualifying: integer(),
  altitude: integer(),
  enforceSlowQtime: integer(),
  banNoTimes: integer(),
  fastToSlow: integer(),
  masters: integer(),
  activeFeeXMLSent: integer(),
  minAge10AndUnder: integer(),
  deadLine: date(),
  custIndCharge: integer(),
  custRelCharge: integer(),
  custSurCharge: integer(),
  custIndAction: integer(),
  custRelAction: integer(),
  custSurAction: integer(),
  useCustomFees: integer(),
  city: varchar(),
  state: varchar(),
  zip: varchar(),
  cntry: varchar(),
  omeEntryStyle: integer(),
  allowCustomTimes: integer(),
  exportEntriesDate: date(),
  useSwimmersTeam: integer(),
  honorInviteList: integer(),
  entryTeam: integer(),
  collectFeesOnline: integer(),
  omeValidated: integer(),
  omeCustomTeam: integer(),
  omeFilterTeam: integer(),
  omeNeedSync: integer(),
  onlyPreEntered: integer(),
  omeNeedsSync: integer(),
  fileExportType: integer(),
});

/*{"Meet":142,"MtEv":24,"Lo_Hi":99,"Course":"Y","MtEvent":2122,"Distance":400,"Stroke":1,"Sex":"M","I_R":"R","Session":1}
 */

export const meetEventsTable = pgTable("meet_events", {
  meet: integer(),
  eventNumber: integer(),
  loHi: integer(),
  course: varchar(),
  mtEvent: integer().primaryKey(),
  distance: integer(),
  stroke: integer(),
  sex: varchar(),
  iR: varchar(),
  session: integer(),
});

export const meetRelations = relations(meetTable, ({ many }) => {
  return {
    events: many(meetEventsTable),
  };

});

export const meetEventsRelations = relations(meetEventsTable, ({ one, many }) => {
  return {
    meet: one(meetTable, {
      fields: [meetEventsTable.meet],
      references: [meetTable.meet],
    }),
    entries: many(entryTable),
    results: many(resultsTable),
  };
});
/*{"Meet":144,"Athlete":480,"I_R":"E","Team":1,"Course":"Y","Ex":"4","MtEvent":2286,"Misc":"C","Entry":13897,"HEAT":0,"LANE":0,"FromOME":0}
 */

export const entryTable = pgTable("entries", {
  meet: integer(),
  athlete: integer(),
  iR: varchar(),
  team: integer(),
  course: varchar(),
  ex: varchar(),
  mtEvent: integer(),
  misc: varchar(),
  entry: integer().primaryKey(),
  heat: integer(),
  lane: integer(),
  fromOME: integer(),
});

export const entryRelations = relations(entryTable, ({ one }) => {
  return {
    meet: one(meetTable, {
      fields: [entryTable.meet],
      references: [meetTable.meet],
    }),
    athlete: one(athleteTable, {
      fields: [entryTable.athlete],
      references: [athleteTable.athlete],
    }),
    event: one(meetEventsTable, {
      fields: [entryTable.mtEvent],
      references: [meetEventsTable.mtEvent],
    }),
  };
});
/*{"RELAY":2512,"MEET":144,"LO_HI":99,"TEAM":1,"LETTER":"C","AGE_RANGE":0,"SEX":"F","ATH(1)":506,"ATH(2)":497,"ATH(3)":586,"ATH(4)":480,"DISTANCE":200,"STROKE":5}
 */
export const relayTable = pgTable("relays", {
  meet: integer(),
  relay: integer().primaryKey(),
  loHi: integer(),
  team: integer(),
  letter: varchar(),
  ageRange: integer(),
  sex: varchar(),
  ath1: integer(),
  ath2: integer(),
  ath3: integer(),
  ath4: integer(),
  distance: integer(),
  stroke: integer(),
});

/* {"MEET":142,"ATHLETE":491,"I_R":"L","TEAM":1,"SCORE":5443,"F_P":"F","EX":" ","NT":0,"RESULT":9352,"AGE":0,"DISTANCE":100,"STROKE":1,"MTEVENT":2122,"POINTS":0,"PLACE":0,"RANK":3,"COURSE":"Y"}
 */

export const resultsTable = pgTable("results", {
  meet: integer(),
  athlete: integer(),
  iR: varchar(),
  team: integer(),
  score: integer(),
  fP: varchar(),
  ex: varchar(),
  nt: integer(),
  result: integer(),
  age: integer(),
  distance: integer(),
  stroke: integer(),
  mtEvent: integer(),
  points: integer(),
  place: integer(),
  rank: integer(),
  course: varchar(),
});
/*{"SplitID":9341,"SplitIndex":8,"Split":13723}*/
export const splitsTable = pgTable("splits", {
  splitID: integer(),
  splitIndex: integer(),
  split: integer(),
});
export const splitsRelations = relations(splitsTable, ({ one }) => {
  return {
    result: one(resultsTable, {
      fields: [splitsTable.split],
      references: [resultsTable.result],
    }),
  };
});
export const resultsRelations = relations(resultsTable, ({ one, many }) => {
  return {
    meet: one(meetTable, {
      fields: [resultsTable.meet],
      references: [meetTable.meet],
    }),
    athlete: one(athleteTable, {
      fields: [resultsTable.athlete],
      references: [athleteTable.athlete],
    }),
    event: one(meetEventsTable, {
      fields: [resultsTable.mtEvent],
      references: [meetEventsTable.mtEvent],
    }),
    splits: many(splitsTable),
  };
});
export const relayRelations = relations(relayTable, ({ one }) => {
  return {
    meet: one(meetTable, {
      fields: [relayTable.meet],
      references: [meetTable.meet],
    }),
    athlete1: one(athleteTable, {
      fields: [relayTable.ath1],
      references: [athleteTable.athlete],
    }),
    athlete2: one(athleteTable, {
      fields: [relayTable.ath2],
      references: [athleteTable.athlete],
    }),
    athlete3: one(athleteTable, {
      fields: [relayTable.ath3],
      references: [athleteTable.athlete],
    }),
    athlete4: one(athleteTable, {
      fields: [relayTable.ath4],
      references: [athleteTable.athlete],
    }),
  };
});

export const teamRelations = relations(teamsTable, ({ many }) => {
  return {
    athletes: many(athleteTable),
  };
});
export const athleteRelations = relations(athleteTable, ({ many, one }) => {
  return {
    entries: many(entryTable),
    results: many(resultsTable),
    //relays: many(relayTable),
    team: one(teamsTable, {
      fields: [athleteTable.team1],
      references: [teamsTable.team],
    }),
  };
});
