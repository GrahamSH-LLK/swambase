import fs from "fs/promises";
import {useDrizzle, tables} from "../utils/db"
const db = useDrizzle();
const schema = tables;

export const importData = async () => {
  const basePath = `./lhs_team_24`;
  const stringToArray = (str: string): Array<any> => {
    return str
      .split("\n")
      .filter((x) => x.length)
      .map((item) => JSON.parse(item));
  };

  /* 
    JSON files contain line separated JSON objects. Each object is a record in the database.
*/
  // add teams
  /*{"Team":1,"TCode":"LONG","TName":"Longmeadow High School","Short":"Lancers","LSC":"NE","TState":"MA","TCntry":"USA","TType":"HS","Reg":"USS","MinAge":0,"NumAth":59,"TM2000":0}
   */
  const teams = await fs.readFile(`${basePath}/TEAM.json`, "utf8");

  for (const team of stringToArray(teams)) {
    await db.insert(schema.teamsTable).values({
      team: team.Team,
      tCode: team.TCode,
      tName: team.TName,
      short: team.Short,
      lsc: team.LSC,
      tState: team.TState,
      tCntry: team.TCntry,
      tType: team.TType,
      reg: team.Reg,
      minAge: team.MinAge,
      numAth: team.NumAth,
      tm2000: team.TM2000,
    });
  }

  // add athletes
  /* {"Athlete":109,"Team1":1,"Team2":0,"Team3":0,"Group":" ","SubGr":" ","Last":"Griffiths","First":"Austin","Sex":"M","Age":0,"Class":"21","Inactive":1,"Batch":0,"WMGroup":" ","WMSubGr":" ","DiveCertified":0,"AWRegType":"K","Foreign":0,"PC_Hide":0}
   */

  const athletes = await fs.readFile(`${basePath}/Athlete.json`, "utf8");

  for (const athlete of stringToArray(athletes)) {
    await db.insert(schema.athleteTable).values({
      athlete: athlete.Athlete,
      team1: athlete.Team1,
      team2: athlete.Team2,
      team3: athlete.Team3,
      group: athlete.Group,
      subGr: athlete.SubGr,
      last: athlete.Last,
      first: athlete.First,
      sex: athlete.Sex,
      age: athlete.Age,
      class: athlete.Class,
      inactive: athlete.Inactive === 1,
      wmGroup: athlete.WMGroup,
      wmSubGr: athlete.WMSubGr,
      diveCertified: athlete.DiveCertified === 1,
      awRegType: athlete.AWRegType,
      foreign: athlete.Foreign === 1,
      pcHide: athlete.PC_Hide === 1,
    });
  }

  // add meets
  /* {"Meet":144,"MName":"LhsvsEhs","Start":"12/16/23 00:00:00","End":"12/16/23 00:00:00","Course":"Y","Location":"LHS","IndCharge":0,"RelCharge":0,"SurCharge":0,"MaxIndEnt":2,"MaxRelEnt":3,"MaxEnt":4,"RestrictBest":0,"NonConform":0,"EnterAtQTime":0,"FacilityFee":0,"TeamFee":0,"MinAge":0,"EnforceQualifying":0,"Altitude":0,"EnforceSlowQtime":0,"BanNoTimes":0,"FastToSlow":0,"Masters":0,"ActiveFeeXMLSent":0,"MinAge10AndUnder":0,"DeadLine":"12/16/23 00:00:00","CustIndCharge":0,"CustRelCharge":0,"CustSurCharge":0,"CustIndAction":0,"CustRelAction":0,"CustSurAction":0,"UseCustomFees":0,"City":"Longmeadow","State":"MA","ZIP":"01007","Cntry":"USA","OMEEntryStyle":3,"AllowCustomTimes":0,"ExportEntriesDate":"12/19/23 00:00:00","UseSwimmersTeam":1,"HonorInviteList":0,"EntryTeam":0,"CollectFeesOnline":0,"OMEValidated":0,"OMECustomTeam":0,"OMEFilterTeam":0,"OMENeedSync":0,"OnlyPreEntered":0,"OMENeedsSync":0,"FileExportType":1}
   */

  const meets = await fs.readFile(`${basePath}/MEET.json`, "utf8");

  for (let meet of stringToArray(meets)) {
    await db.insert(schema.meetTable).values({
      meet: meet.Meet,
      mName: meet.MName,
      start: meet.Start,
      end: meet.End,
      course: meet.Course,
      location: meet.Location,
      indCharge: meet.IndCharge,
      relCharge: meet.RelCharge,
      surCharge: meet.SurCharge,
      maxIndEnt: meet.MaxIndEnt,
      maxRelEnt: meet.MaxRelEnt,
      maxEnt: meet.MaxEnt,
      restrictBest: meet.RestrictBest,
      nonConform: meet.NonConform,
      enterAtQTime: meet.EnterAtQTime,
      facilityFee: meet.FacilityFee,
      teamFee: meet.TeamFee,
      minAge: meet.MinAge,
      enforceQualifying: meet.EnforceQualifying,
    });
  }

  // add events
  /* {"Meet":142,"MtEv":24,"Lo_Hi":99,"Course":"Y","MtEvent":2122,"Distance":400,"Stroke":1,"Sex":"M","I_R":"R","Session":1}
   */

  const events = await fs.readFile(`${basePath}/MTEVENT.json`, "utf8");

  for (let event of stringToArray(events)) {
    /*await db.insert(schema.meetEventsTable).values({
      meet: event.Meet + 2, // wtf
      eventNumber: event.MtEv,
      loHi: event.Lo_Hi,
      course: event.Course,
      mtEvent: event.MtEvent,
      distance: event.Distance,
      stroke: event.Stroke,
      sex: event.Sex,
      iR: event.I_R,
    });*/
  }

  // add e events 
  /*{"Meet":142,"MtEv":16,"Lo_Hi":99,"MtEvent":2276,"Distance":500,"Stroke":1,"Sex":"M","I_R":"I","Session":0,"Fee":0}*/
  const eEvents = await fs.readFile(`${basePath}/MTEVENTE.json`, "utf8");

  for (let event of stringToArray(eEvents)) {
    await db.insert(schema.meetEventsTable).values({
      meet: event.Meet,
      eventNumber: event.MtEv,
      loHi: event.Lo_Hi,
      mtEvent: event.MtEvent,
      distance: event.Distance,
      stroke: event.Stroke,
      sex: event.Sex,
      iR: event.I_R,
      session: event.Session,
      
    }).onConflictDoNothing()
  }

  // add entries
  /* {"Meet":144,"Athlete":480,"I_R":"E","Team":1,"Course":"Y","Ex":"4","MtEvent":2286,"Misc":"C","Entry":13897,"HEAT":0,"LANE":0,"FromOME":0}
   */

  const entries = await fs.readFile(`${basePath}/ENTRY.json`, "utf8");

  for (let entry of stringToArray(entries)) {
    await db.insert(schema.entryTable).values({
      meet: entry.Meet,
      athlete: entry.Athlete,
      iR: entry.I_R,
      team: entry.Team,
      course: entry.Course,
      ex: entry.Ex,
      mtEvent: entry.MtEvent,
      misc: entry.Misc,
      entry: entry.Entry,
      heat: entry.HEAT,
      lane: entry.LANE,
      fromOME: entry.FromOME,
    });
  }

  // add relays

  /*{"RELAY":2512,"MEET":144,"LO_HI":99,"TEAM":1,"LETTER":"C","AGE_RANGE":0,"SEX":"F","ATH(1)":506,"ATH(2)":497,"ATH(3)":586,"ATH(4)":480,"DISTANCE":200,"STROKE":5}
   */

  const relays = await fs.readFile(`${basePath}/RELAY.json`, "utf8");

  for (let relay of stringToArray(relays)) {
    await db.insert(schema.relayTable).values({
      relay: relay.RELAY,
      meet: relay.MEET,
      loHi: relay.LO_HI,
      team: relay.TEAM,
      letter: relay.LETTER,
      ageRange: relay.AGE_RANGE,
      sex: "F",
      ath1: relay["ATH(1)"],
      ath2: relay["ATH(2)"],
      ath3: relay["ATH(3)"],
      ath4: relay["ATH(4)"],
      distance: relay.DISTANCE,
      stroke: relay.STROKE,
    });
  }

  // add results

  /*{"MEET":24,"ATHLETE":85,"I_R":"N","TEAM":1,"SCORE":6140,"F_P":"F","NT":0,"RESULT":2511,"AGE":0,"DISTANCE":100,"STROKE":1,"MTEVENT":449,"POINTS":0,"PLACE":0,"RANK":6,"COURSE":"Y"}
   */

  const results = await fs.readFile(`${basePath}/RESULT.json`, "utf8");

  for (let result of stringToArray(results)) {
    await db.insert(schema.resultsTable).values({
      meet: result.MEET,
      athlete: result.ATHLETE,
      iR: result.I_R,
      team: result.TEAM,
      score: result.SCORE,
      fP: result.F_P,
      nt: result.NT,
      result: result.RESULT,
      age: result.AGE,
      distance: result.DISTANCE,
      stroke: result.STROKE,
      mtEvent: result.MTEVENT,
      points: result.POINTS,
      place: result.PLACE,
      rank: result.RANK,
      course: result.COURSE,
    });
  }

  // add splits

  /*{"SplitID":9352,"SplitIndex":2,"Split":2613}
   */

  const splits = await fs.readFile(`${basePath}/SPLITS.json`, "utf8");

  for (let split of stringToArray(splits)) {
    await db.insert(schema.splitsTable).values({
      splitID: split.SplitID,
      splitIndex: split.SplitIndex,
      split: split.Split,
    });
  }
};

await importData();