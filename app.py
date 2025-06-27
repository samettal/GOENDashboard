from flask import Flask, render_template, jsonify
from SyntheticValueGenerator import SyntheticValueGenerator
from DatabaseManager import DatabaseManager


class FlaskApp:
    def __init__(self, config=None):
        self.app = Flask(__name__)
        self.db_manager = DatabaseManager()
        self.synthetic_value_generator = SyntheticValueGenerator(self.db_manager)

        if config:
            self.app.config.from_object(config)

        self._register_routes()

    def _register_routes(self):
        self.app.route("/")(self.main_page)
        self.app.route("/api/data")(self.current_data)

    def main_page(self):
        return render_template("index.html")

    def current_data(self):
        production_value = self.synthetic_value_generator.production_value
        consumption_value = self.synthetic_value_generator.consumption_value
        last_10_timestamps, last_10_values_production, last_10_values_consumption = self.db_manager.select_last_10_data()
        daily_balance = self.db_manager.get_daily_balance()

        yesterday_balance_0_and_6 = self.db_manager.get_yesterday_balance_between_0_and_6()
        yesterday_balance_6_and_12 = self.db_manager.get_yesterday_balance_between_6_and_12()
        yesterday_balance_12_and_18 = self.db_manager.get_yesterday_balance_between_12_and_18()
        yesterday_balance_18_and_24 = self.db_manager.get_yesterday_balance_between_18_and_24()
        yesterday_whole_balance = self.db_manager.get_yesterday_whole_balance()
        yesterday_balance_values:list = [yesterday_balance_0_and_6[0], yesterday_balance_6_and_12[0],
                                         yesterday_balance_12_and_18[0], yesterday_balance_18_and_24[0],
                                         yesterday_whole_balance[0]]

        return jsonify({
            "last_10_timestamps": last_10_timestamps,
            "last_10_values_production": last_10_values_production,
            "last_10_values_consumption": last_10_values_consumption,

            "yesterday_balance_values": yesterday_balance_values,
        })

    def run(self, **kwargs):
        self.app.run(**kwargs)


if __name__ == "__main__":
    flask_app = FlaskApp()
    flask_app.run(debug=False)

