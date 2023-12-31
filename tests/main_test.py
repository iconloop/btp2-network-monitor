import unittest
from btp2_monitor.main import build_slack_message
from btp2_monitor.monitor import LinkEvent

from readerwriterlock import rwlock

class FakeLink:
	def __init__(self, src: str, dst: str) -> None:
		self.src_name = src
		self.dst_name = dst

class MainTest(unittest.TestCase):
	def test_build_slack_message(self):
		events = [
			LinkEvent.StateEvent(FakeLink('0x1.icon', '0x32.eth2'), "BAD", "GOOD"),
		]
		msg = build_slack_message(events)
		print(msg)


	def test_rwlock(self):
		lock = rwlock.RWLockFair()
		try :
			with lock.gen_wlock():
				raise Exception("FAILED")
		except BaseException as exc:
			with lock.gen_wlock():
				print("TEST IS OK")

