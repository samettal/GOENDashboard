import random
import threading
import time

class SyntheticValueGenerator:
    def __init__(self, db_manager):
        self._timer = None
        self.db_manager = db_manager
        self._run_periodic()


    def _generate_random_value(self):
        return random.randint(0, 2000)

    # TODO: This _run_periodic() method can be divided into target-focused methods.
    def _run_periodic(self):
        current_timestamp = time.time()

        self.production_value = self._generate_random_value()
        self.consumption_value = self._generate_random_value()
        balance = self.production_value - self.consumption_value
        print(f"Production: {self.production_value}")
        print(f"Consumption: {self.consumption_value}")
        print(f"Balance: {balance}")

        self.db_manager.insert_energy_values(current_timestamp, self.production_value, self.consumption_value, balance)

        self._timer = threading.Timer(10.0, self._run_periodic)
        self._timer.start()

