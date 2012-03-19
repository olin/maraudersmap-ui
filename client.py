import requests, json, urllib

def get_users(**crit):
	r = requests.get('http://127.0.0.1:5000/users/?' + urllib.urlencode(crit))
	return json.loads(r.text)['users']

def get_user(username):
	r = requests.get('http://127.0.0.1:5000/users/%s' % username)
	return json.loads(r.text)['user']

def put_user(username, **kargs):
	kargs['username'] = username
	r = requests.put('http://127.0.0.1:5000/users/%s' % username, data=kargs)
	return json.loads(r.text)['user']

def patch_user(username, **kargs):
	patch = [{"replace": "/" + k, "value": v} for k, v in kargs.items()]
	r = requests.patch('http://127.0.0.1:5000/users/%s' % username, data=json.dumps(patch), headers={"content-type": "application/json"})
	return json.loads(r.text)['user']

def delete_user(username):
	r = requests.delete('http://127.0.0.1:5000/users/%s' % username)
	return r.text

# Places

def get_places(**crit):
	r = requests.get('http://127.0.0.1:5000/places/?' + urllib.urlencode(crit))
	return json.loads(r.text)['places']

def get_place(id):
	r = requests.get('http://127.0.0.1:5000/places/%s' % id)
	return json.loads(r.text)['place']

def post_place(**kargs):
	r = requests.post('http://127.0.0.1:5000/places/', data=kargs)
	return json.loads(r.text)['place']

def patch_place(id, **kargs):
	patch = [{"replace": "/" + k, "value": v} for k, v in kargs.items()]
	r = requests.patch('http://127.0.0.1:5000/places/%s' % id, data=json.dumps(patch), headers={"content-type": "application/json"})
	return json.loads(r.text)['place']

def delete_place(id):
	r = requests.delete('http://127.0.0.1:5000/places/%s' % id)
	return r.text

# Binds

def get_binds(**crit):
	r = requests.get('http://127.0.0.1:5000/binds/?' + urllib.urlencode(crit))
	return json.loads(r.text)['binds']

def get_bind(id):
	r = requests.get('http://127.0.0.1:5000/binds/%s' % id)
	return json.loads(r.text)['bind']

def post_bind(**kargs):
	signals = kargs.get('signals', {})
	if kargs.has_key('signals'):
		del kargs['signals']
	for k, v in signals.items():
		kargs['signals[%s]' % k] = v
	r = requests.post('http://127.0.0.1:5000/binds/', data=kargs)
	print r.text
	return json.loads(r.text)['bind']

def delete_bind(id):
	r = requests.delete('http://127.0.0.1:5000/binds/%s' % id)
	return r.text

# Positions

def get_positions(**crit):
	r = requests.get('http://127.0.0.1:5000/positions/?' + urllib.urlencode(crit))
	return json.loads(r.text)['positions']

def get_position(id):
	r = requests.get('http://127.0.0.1:5000/positions/%s' % id)
	return json.loads(r.text)['position']

def post_position(**kargs):
	r = requests.post('http://127.0.0.1:5000/positions/', data=kargs)
	return json.loads(r.text)['position']

def delete_position(id):
	r = requests.delete('http://127.0.0.1:5000/positions/%s' % id)
	return r.text

# Test suite

print "USERS:"
print get_users()
put_user('jceipek', alias='Julian Ceipek')
print get_user('jceipek')
delete_user('jceipek')
patch_user('tryan', alias='Timmmmmmmy')
print get_users()
patch_user('tryan', alias='Tim Ryan')
print "\n"

print "PLACES:"
print get_places()
place = post_place(name='Computer Lab', floor='MHLL', alias='Den of Theives')
patch_place(place['id'], alias='Compy 386')
print get_place(place['id'])
delete_place(place['id'])
print get_places()
print "\n"

print "BINDS:"
print get_binds()
bind = post_bind(username='tryan', place=get_places()[0]['id'], signals={'AA:AA:AA:AA:AA:AA': 100}, x=50, y=50)
print get_bind(bind['id'])
delete_bind(bind['id'])
print "\n"

print "POSITIONS:"
print get_positions()
pos = post_position(username='tryan', bind=get_binds()[0]['id'])
print get_position(pos['id'])
delete_position(pos['id'])
print "\n"