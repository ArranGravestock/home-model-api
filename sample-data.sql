INSERT INTO Devices SET DeviceID = 'UBVXug97hdIAwOM', DeviceName='home model'

INSERT INTO Things SET ThingID=0, DeviceID='UBVXug97hdIAwOM', ThingName='fan control', ThingType='remote'
INSERT INTO Things SET ThingID=2, DeviceID='UBVXug97hdIAwOM', ThingName='fan control 2', ThingType='remote'
INSERT INTO Things SET ThingID=3, DeviceID='UBVXug97hdIAwOM', ThingName='touch', ThingType='sensor'
INSERT INTO Things SET ThingID=4, DeviceID='UBVXug97hdIAwOM', ThingName='motion', ThingType='sensor'
INSERT INTO Things SET ThingID=5, DeviceID='UBVXug97hdIAwOM', ThingName='vibration', ThingType='sensor'
INSERT INTO Things SET ThingID=7, DeviceID='UBVXug97hdIAwOM', ThingName='light 1', ThingType='light'
INSERT INTO Things SET ThingID=22, DeviceID='UBVXug97hdIAwOM', ThingName='sound', ThingType='sensor'
INSERT INTO Things SET ThingID=26, DeviceID='UBVXug97hdIAwOM', ThingName='temperature', ThingType='sensor'
INSERT INTO Things SET ThingID=27, DeviceID='UBVXug97hdIAwOM', ThingName='humidity', ThingType='sensor'
INSERT INTO Things SET ThingID=29, DeviceID='UBVXug97hdIAwOM', ThingName='ultrasonic', ThingType='sensor'

INSERT INTO Users SET UserID=1, UserName='guest', Password='password', Email='guest@email.com'
INSERT INTO UserDevices SET UserID=1, DeviceID='UBVXug97hdIAwOM'

INSERT INTO Logs SET DeviceID='UBVXug97hdIAwOM', ThingID=7, ThingState=0
INSERT INTO Logs SET DeviceID='UBVXug97hdIAwOM', ThingID=0, ThingState=0
INSERT INTO Logs SET DeviceID='UBVXug97hdIAwOM', ThingID=2, ThingState=0